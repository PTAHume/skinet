using System.Threading.Tasks;
using API.DTO;
using API.Errors;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;
using API.DTOs;
using AutoMapper;

namespace API.Controllers;

public class AccountController : BaseApiController
{
	private readonly UserManager<AppUser> _userManager;
	private readonly SignInManager<AppUser> _signInManager;
	private readonly ITokenService _tokenService;
	private readonly IMapper _mapper;

	public AccountController(UserManager<AppUser> userManager,
		SignInManager<AppUser> signInManager, ITokenService tokenService,
		IMapper mapper)
	{
		_userManager = userManager;
		_signInManager = signInManager;
		_tokenService = tokenService;
		_mapper = mapper;
	}

	[HttpGet]
	[Authorize]
	public async Task<ActionResult<UserDTO>> GetCurrentUser()
	{
		var user = await _userManager.FindByEmailClaimsPrinciple(User);
		return new UserDTO()
		{
			Email = user.Email,
			DisplayName = user.DisplayName,
			Token = _tokenService.CreateToken(user)
		};
	}

	[HttpGet("emailExists")]
	public async Task<ActionResult<bool>> CheckEmailExists([FromQuery] string email)
	{
		return await _userManager.FindByEmailAsync(email) != null;
	}

	[HttpGet("address")]
	[Authorize]
	public async Task<ActionResult<AddressDTO>> GetUserAddress()
	{
		var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);
		return _mapper.Map<AddressDTO>(user.Address);
	}

	[HttpPut("address")]
	[Authorize]
	public async Task<ActionResult<AddressDTO>> UpdateUserAddress(AddressDTO address)
	{
		var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);
		user.Address = _mapper.Map<Address>(address);
		var result = await _userManager.UpdateAsync(user);
		if (result.Succeeded) return Ok(_mapper.Map<AddressDTO>(user.Address));
		return BadRequest("Problem updating the user");
	}

	[HttpPost("login")]
	public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
	{
		var user = await _userManager.FindByEmailAsync(loginDTO.Email);
		if (user == null) return Unauthorized(new ApiResponse(401));

		var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

		if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

		return new UserDTO()
		{
			Email = user.Email,
			DisplayName = user.DisplayName,
			Token = _tokenService.CreateToken(user)
		};
	}

	[HttpPost("register")]
	public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
	{

		if (CheckEmailExists(registerDTO.Email).Result.Value)
		{
			return new BadRequestObjectResult(
				new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
		}
		
		var user = new AppUser()
		{
			DisplayName = registerDTO.DisplayName,
			Email = registerDTO.Email,
			UserName = registerDTO.Email,
		};

		var result = await _userManager.CreateAsync(user, registerDTO.Password);

		if (!result.Succeeded) return BadRequest(new ApiResponse(400));

		return new UserDTO()
		{
			Email = user.Email,
			DisplayName = user.DisplayName,
			Token = _tokenService.CreateToken(user)
		};
	}
}
